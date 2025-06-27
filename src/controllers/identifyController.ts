import { Request, Response } from "express";
import { Contact, PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const identifyContact = async (req: Request, res: Response) => {

    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        res.status(400).json({
            message: "At least email or phone number is required"
        })
        return;
    }

    const contacts = await prisma.contact.findMany({
        where: {
            OR: [
                { phoneNumber: phoneNumber || null },
                { email: email || null }
            ]
        }
    })

    const primaryIds = new Set<number>();

    for (const contact of contacts) {
        if (contact.linkPrecedence === 'primary') {
            primaryIds.add(contact.id);
        }
        else if (contact.linkedId) {
            primaryIds.add(contact.linkedId);
        }
    }

    let primaryContact: Contact;

    if (primaryIds.size > 0) {

        const allContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    {
                        id: { in: [...primaryIds] }
                    },
                    {
                        linkedId: { in: [...primaryIds] }
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        primaryContact = allContacts[0];

        const contactsToUpdate = allContacts.slice(1);

        // primary contacts turn into secondary
        for (const contact of contactsToUpdate) {
            await prisma.contact.update({
                where: {
                    id: contact.id
                },
                data: {
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary'
                }
            })
        }



        const isEmailPresent = allContacts.find((c) => c.email === email);
        const isPhoneNumberPresent = allContacts.find((c) => c.phoneNumber === phoneNumber);

        //new information
        if ((!isEmailPresent && email) || (!isPhoneNumberPresent && phoneNumber)) {
            await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary'
                }
            })
        }


    }
    else {

        //no existing contact
        primaryContact = await prisma.contact.create({
            data: {
                phoneNumber,
                email,
                linkPrecedence: 'primary'
            }
        })
    }

    const finalContacts = await prisma.contact.findMany({
        where: {
            OR: [
                {
                    id: primaryContact.id
                },
                {
                    linkedId: primaryContact.id
                }
            ]
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    const emails = [... new Set(finalContacts.map(c => c.email).filter(email => email))];

    const phoneNumbers = [... new Set(finalContacts.map(c => c.phoneNumber).filter(phoneNumber => phoneNumber))];

    const secondaryContactIds = finalContacts
        .filter(c => c.linkPrecedence === 'secondary')
        .map(c => c.id);

    res.status(200).json({
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    })

}