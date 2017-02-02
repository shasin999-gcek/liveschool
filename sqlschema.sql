/*conversion list */
SELECT "user".id,chat.id,"user".first_name,"user".email
FROM "user", chat, chat_reply
WHERE

CASE

WHEN chat.user_1 = '16'
THEN chat.user_2 = "user".id
WHEN chat.user_2 = '16'
THEN chat.user_1= "user".id
END

AND
chat.id = chat_reply.chat_id
AND
(chat.user_1 ='16' OR chat.user_2 ='16') ORDER BY chat.id DESC

/* selecting perticular conversion between user and another user */
SELECT R.time,R.reply,U.id,U.first_name,U.email
FROM "user" U, chat_reply R
WHERE R.user_id_fk=U.id AND R.chat_id='2'
ORDER BY R.time DESC
