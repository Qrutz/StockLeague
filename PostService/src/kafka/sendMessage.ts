import producer from './setup';

const sendMessage = async (topic: string, message: string) => {
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [{ value: message }],
    });
    await producer.disconnect();
}


export default sendMessage;