import { WebhookEvent } from '@clerk/clerk-sdk-node';
import bodyParser from 'body-parser';
import express from 'express';
import { Webhook } from 'svix';

import dotenv from 'dotenv';
import { db } from '../db/setup';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  async function (req, res) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('You need a WEBHOOK_SECRET in your .env ');
    }

    // Grab the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers['svix-id'] as string;
    const svix_timestamp = headers['svix-timestamp'] as string;
    const svix_signature = headers['svix-signature'] as string;

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      });
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    console.log(WEBHOOK_SECRET);
    console.log(payload);
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;

      console.log(evt.data);
    } catch (err: any) {
      // Console log and return errro
      console.log('Webhook failed to verify. Error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    console.log();

    // Grab the ID and TYPE of the Webhook
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    // Console log the full payload to view
    console.log('Webhook body:', evt.data);

    // if eventType is user.created, then create a new user in your database, etc.

    if (eventType === 'user.created') {
      // Create a new user in your database

      // check if email isnt undefined

      try {
        await db
          .insert(schema.users)
          .values({
            // @ts-expect-error idk why this is happening
            userId: evt.data.id,
            email: evt.data.email_addresses[0].email_address,
            username: evt.data.username,
            first_name: evt.data.first_name,
            last_name: evt.data.last_name,
            image_url: evt.data.image_url,
            createdAt: evt.data.created_at,
          })
          .execute();

        console.log('User created');

        return res.status(200).json({
          success: true,
          message: 'User has been created',
        });
      } catch (err: any) {
        console.log(err);
      }
    } else if (eventType === 'user.updated') {
      // Update the user in your database
      try {
        await db
          .update(schema.users)
          .set({
            email: evt.data.email_addresses[0].email_address,
            username: evt.data.username,
            first_name: evt.data.first_name,
            last_name: evt.data.last_name,
            last_sign_in_at: evt.data.last_sign_in_at?.toString(),
            updated_at: evt.data.updated_at.toString(),
            image_url: evt.data.image_url,
            createdAt: evt.data.created_at.toString(),
          })
          .where(eq(schema.users.userId, evt.data.id))
          .execute();

        console.log('User updated');

        return res.status(200).json({
          success: true,
          message: 'User has been updated',
        });
      } catch (err: any) {
        console.log(err);
      }
    } else if (eventType === 'user.deleted') {
      // Delete the user in your database
      try {
        console.log(evt.data.id);
        await db
          .delete(schema.users)
          .where(eq(schema.users.userId, evt.data.id!!));

        console.log('User deleted');

        return res.status(200).json({
          success: evt.data.deleted,
          message: 'User has been deleted',
        });
      } catch (err: any) {
        console.log(err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  }
);

export default router;
