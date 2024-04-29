# AktieLigan/Stockleague

```diff
- Development has stopped on project because stock data requires parterships or spending 20k+ monthly on finace websockets

```

|                                                                                                                           |                                                                                                                           |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| ![Screenshot 2024-04-27 234701](/Client/public/b1.png) | ![Screenshot 2024-04-27 234602](/Client/public/b2.png) |

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

### Simplified overview ![Blank diagram](/Client/public/b3.png)

### API Gateway

Authorizes and Proxies requests to releveant service

### Post Service

Handles post and prediction CRUD, comment creation etc. Everything that has to do with posts. Alerts other services of events such as comments and likes so they can sync data.

![Blank diagram (1)](/Client/public/b4.png)

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
| ![Screenshot 2024-04-27 234701](/Client/public/b5.png) | ![Screenshot 2024-04-27 234602](/Client/public/b6.png) |

|                                            Profile page                                             |                                                 User page                                                  |
| :-------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
| ![mypage](/Client/public/b7.png) | ![followingpage](/Client/public/b8.png) |

|                                               Edit profile                                               |                                            Postpage                                             |
| :------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| ![editprofile](/Client/public/b9.png) | ![cc](/Client/public/b10.png) |

## Post Creator

Built with slatejs

- GIFS & IMG Functionality
- Autocomplete ticker mentions
- People mentions coming soon

![postasdf](/Client/public/gifs/g1.gif)

### Realtime events examples

|                                         New posts availible popup                                         |                                              Count/Comment updates                                              |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: |
| ![realpostsgif](/Client/public/gifs/g2.gif) | ![ezgif-1-0ef2f53fe4](/Client/public/gifs/g3.gif) |
