import React from "react";

export type ContactProps = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

type ContactListProps = {
    contacts: ContactProps[];
    updateContact: (contact: ContactProps) => void;
    updateCallback: () => void;
};

export const ContactList = ({
    contacts,
    updateContact,
    updateCallback
}: ContactListProps) => {
    const onDelete = async (id: string) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/delete_contact/${id}`,
                options
            );

            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };
    return (
        <div>
            <h2>Contacts</h2>
            <table>
                <thead>
                    <tr>
                        <th>FirstName</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>
                                <button onClick={() => updateContact(contact)}>
                                    Update
                                </button>
                                <button onClick={() => onDelete(contact.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
