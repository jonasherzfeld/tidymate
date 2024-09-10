import React, { useState, useEffect } from "react";
import { Greet } from "./components/Greet";
import { ContactList, ContactProps } from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import "./App.css";

function App() {
    const [contacts, setContacts] = useState<ContactProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState<ContactProps>();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const response = await fetch("/contacts");
        const data = await response.json();
        setContacts(data.contacts);
        console.log(data);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openCreateModal = () => {
        if (!isModalOpen) setIsModalOpen(true);
    };

    const openEditModal = (contact: ContactProps) => {
        if (isModalOpen) return;
        setCurrentContact(contact);
        setIsModalOpen(true);
    };

    const onUpdate = () => {
        closeModal();
        fetchContacts();
    };

    return (
        <div className="App">
            <Greet name="Jonas" />
            <>
                <ContactList
                    contacts={contacts as ContactProps[]}
                    updateContact={openEditModal}
                    updateCallback={onUpdate}
                />
                <button onClick={openCreateModal}>Create New Contact</button>
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>
                                &times;
                            </span>
                            <ContactForm
                                existingContact={currentContact}
                                updateCallback={onUpdate}
                            />
                        </div>
                    </div>
                )}
            </>
        </div>
    );
}

export default App;
