import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User Invitation (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let adminEstablishmentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        email: 'admin-invite@test.com',
        nom: 'Admin',
        prenom: 'Invite',
        password: 'Test1234!',
        schoolName: 'Test School Invite'
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.access_token).toBeDefined();
    adminToken = res.body.access_token;
    adminEstablishmentId = res.body.user.establishmentId;
  });

  it('should invite a user with role ADMIN', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/invite')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'invited-admin@test.com',
        role: 'ADMIN'
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.establishmentId).toBe(adminEstablishmentId);
  });

  it('should invite a user with role REFERENT', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/invite')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'invited-referent@test.com',
        role: 'REFERENT'
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.establishmentId).toBe(adminEstablishmentId);
  });

  it('should list all users of the establishment', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    // All users should have the same establishmentId
    for (const user of res.body) {
      expect(user.establishmentId).toBe(adminEstablishmentId);
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
