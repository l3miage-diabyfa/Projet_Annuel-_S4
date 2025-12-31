import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        googleId: payload.sub,
        profilePic: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }
}
