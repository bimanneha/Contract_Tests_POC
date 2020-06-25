import { TestBed } from '@angular/core/testing';
import { PactWeb, Matchers } from '@pact-foundation/pact-web';
import { UserDataService } from '../service/userdata.service';
import { User } from '../model/user.model';
import { HttpClientModule } from '@angular/common/http';

describe('Contract Tests - User Data Service', () => {
  let provider;

  beforeAll(function (done) {
    provider = new PactWeb({
      cors: true,
      consumer: 'ui',
      provider: 'userDataService',
      port: 1234,
      host: '127.0.0.1',
    });

    setTimeout(done, 2000);
    provider.removeInteractions();
  });

  afterAll(function (done) {
    provider.finalize()
      .then(function () {
        done();
      }, function (err) {
        done.fail(err);
      });
  });

  beforeEach((done) => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserDataService
      ],
    });

  });

  afterEach((done) => {
    provider.verify().then(done, e => done.fail(e));
  });

  describe('Add User API()', () => {

    const expectedUser: User = { firstName: 'Neha', lastName: 'Biman' };
    const expectedResult = 10;

    beforeAll((done) => {
      provider.addInteraction({
        state: `a request to POST a user data`,
        uponReceiving: 'provider accepts a new user data',
        withRequest: {
          method: 'POST',
          path: '/user-service/users',
          body: expectedUser,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 201,
          body: Matchers.somethingLike({
            id: expectedResult
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }).then(done, error => done.fail(error));
    });

    it('should create a new user', () => {
      let actualResult = 0;
      const userService: UserDataService = TestBed.get(UserDataService);
      userService.addUser(expectedUser).subscribe(actualResult => {
        console.log('POST actualResult', actualResult);
        expect(actualResult).toEqual(expectedResult);
      });
    });
  });

  describe('Update User API()', () => {

    const expectedUser: User = {
      firstName: 'Aditi',
      lastName: 'Bakshi'
    };

    beforeAll((done) => {
      provider.addInteraction({
        state: `a request to PUT a user`,
        uponReceiving: 'user with userId 12 exists',
        withRequest: {
          method: 'PUT',
          path: '/user-service/users/12',
          body: Matchers.somethingLike(expectedUser),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          body: Matchers.somethingLike(expectedUser)
        }
      }).then(done, error => done.fail(error));
    });

    it('should update a user based on user Id', (done) => {
      const userService: UserDataService = TestBed.get(UserDataService);
      userService.updateUser(expectedUser, 12).subscribe(actualResult => {
        console.log('PUT actualResult', actualResult);
        expect(expectedUser.firstName).toEqual(actualResult.firstName);
        expect(expectedUser.lastName).toEqual(actualResult.lastName);
        done();
      }, error => {
        done.fail(error);
      });
    });

  });
});
