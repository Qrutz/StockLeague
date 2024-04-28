# AktieLigan/Stockleague

```diff
- Development has stopped on project because stock data requires parterships or spending 20k+ monthly on finace websockets

```

|                                                                                                                           |                                                                                                                           |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| ![Screenshot 2024-04-27 234701](https://github.com/Qrutz/AktieLigan/assets/40356149/25aa18c5-7624-4e47-8723-83dec46a349c) | ![Screenshot 2024-04-27 234602](https://github.com/Qrutz/AktieLigan/assets/40356149/384c1313-025c-4506-9b3b-654f62600b32) |

## Description

Swedish Finance Platform which entails both posts and predictions, the predictions can either be nested inside the post or be a standalone post. Then at the end of each month the top performing users are rewarded, which was one insentive to attract inital users from already popular platforms which do not offer this with the help of sponsors.

## Stack

- React
- Typescript
- Node, Express
- Kafka
- Redis
- Pusher
- Docker
- Postgres
- MySQL
- Slatejs
- Clerk + BankID Auth
- Drizzle & Prisma ORM (had to change to prisma cus drizzle doesnt allow self to many post/comment nesting)

## System Design

Microservices Event Driven approach to ensure realtime updates when users interact on the platform keeping dopamine levels high.

### Simplified overview ![Blank diagram](https://github.com/Qrutz/AktieLigan/assets/40356149/cbcf043a-9f8b-4bfd-b8b0-83dcbe12d87a)

### API Gateway

Authorizes and Proxies requests to releveant service

### Post Service

Handles post and prediction CRUD, comment creation etc. Everything that has to do with posts. Alerts other services of events such as comments and likes so they can sync data.

![Blank d![Blank diagram (1)](https://github.com/Qrutz/AktieLigan/assets/40356149/d4d0390d-d7f0-47c8-84c5-1fbcc4c7da4b)

### Timeline Service

Timeline mixer that uses posts to create timelines, popular feed based on an algo, new feed, feed by ticker etc.

### User service

Simple restful service that syncs data between clerk and a users database, main usecase is sending user objects corresponding to a UserId in both predictions and posts. Example when quering the timeline we send a batch of unique user ids to this service to get the user objects. Going straight to clerk for all of this data would make us get rate limited instantly if it had users

### Leaderboard Service

Keeps track of standings, algorithm to calculate accuracy of predictions.

### Stock ticker Service

Realtime prices for stock tickers, yoinking yahoos websocket together with fmp's api for proof of concept because actual ticker websockets cost 20k monthly minimum.

## Pages

|                                                           Dark                                                            |                                                           Light                                                           |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| ![Screenshot 2024-04-27 234701](https://github.com/Qrutz/AktieLigan/assets/40356149/25aa18c5-7624-4e47-8723-83dec46a349c) | ![Screenshot 2024-04-27 234602](https://github.com/Qrutz/AktieLigan/assets/40356149/384c1313-025c-4506-9b3b-654f62600b32) |

|                                            Profile page                                             |                                                 User page                                                  |
| :-------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| ![mypage](https://github.com/Qrutz/AktieLigan/assets/40356149/5663ecb9-b674-4df0-90a5-2b57add52c85) | ![followingpage](https://github.com/Qrutz/AktieLigan/assets/40356149/b76b52fa-28bc-471b-b201-e78b19c3c095) |

|                                               Edit profile                                               |                                            Postpage                                             |
| :------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| ![editprofile](https://github.com/Qrutz/AktieLigan/assets/40356149/8e389c87-f665-48dd-a0f1-0a9654ff2b66) | ![cc](https://github.com/Qrutz/AktieLigan/assets/40356149/19643890-5ed6-4a00-a83e-9c18851015ef) |

## Post Creator

Built with slatejs

- GIFS & IMG Functionality
- Autocomplete ticker mentions
- People mentions coming soon

![postasdf](https://github.com/Qrutz/AktieLigan/assets/40356149/c9258f60-b808-4f09-8744-fda14811ca5e)

### Realtime events examples

|                                         New posts availible popup                                         |                                              Count/Comment updates                                              |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
| ![realpostsgif](https://github.com/Qrutz/AktieLigan/assets/40356149/a8a6fcd5-1cb9-44c9-88df-f7151bd5c4b9) | ![ezgif-1-0ef2f53fe4](https://github.com/Qrutz/AktieLigan/assets/40356149/035e4fe5-6325-4c3e-801c-4f82b9c05005) |
