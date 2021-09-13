import React from 'react';
import { useAppSelector } from '../app/hooks';

import { selectMessages } from '../features/messages/messagesSlice';
import styles from './Messages.module.css';
import { Message } from './Message';

export function Messages() {
    const messages = useAppSelector(selectMessages);
    const messageList = messages.map((msg) => <li key={msg.timestamp.toString()}>
        <Message message={msg}/>
    </li>)
    return (
        <div>
            <div className={styles.row}>
                <ul className={styles.messages}>
                    {messageList}
                </ul>
            </div>
        </div>
    );
}
