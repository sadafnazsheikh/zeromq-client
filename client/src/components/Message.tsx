import React from 'react';
import { MessageData } from '../features/messages/messagesSlice';
import styles from './Message.module.css';

export function Message(props: {message: MessageData}) {
    const message: MessageData = props.message;
    const date = new Date(message.timestamp).toISOString();
    return <div className={styles.message}>
        <div className={styles.date}>{date}</div>
        <div className={styles.coord}>{message.lat}</div>
        <div className={styles.coord}>{message.lon}</div>
        <div className={message.information !== undefined ? styles.information: styles.empty}>
            {message.information || 'no information'}
        </div>
    </div>
}