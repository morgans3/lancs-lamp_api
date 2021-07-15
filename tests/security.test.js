//@ts-check

const request = require("supertest");
const { SecureEndpoints } = require("../config/endpoints");
var app, nonToken;
const keyset = [];

beforeAll(async (done) => {
  app = await require("../testapp");
  const { generateInvalidToken } = require("../helpers/generateToken");
  nonToken = generateInvalidToken;
  const securegroup = require("../_credentials/credentials").securegroup;
  securegroup.forEach((key) => {
    keyset.push(key);
  });
  done();
}, 10000);

if (SecureEndpoints.length > 0) {
  describe("Test the Security of All Protected Endpoints", () => {
    SecureEndpoints.forEach((endpoint) => {
      if (endpoint.type !== null) {
        test(
          "Checking endpoint secured: " + endpoint.url,
          async (done) => {
            if (endpoint.method === "get") {
              const response = await request(app).get(encodeURI(endpoint.url));
              expect(response.status).toBe(401);
            } else if (endpoint.method === "post") {
              const response = await request(app).post(encodeURI(endpoint.url));
              expect(response.status).toBe(401);
            } else if (endpoint.method === "put") {
              const response = await request(app).put(encodeURI(endpoint.url));
              expect(response.status).toBe(401);
            }
            done();
          },
          10000
        );

        switch (endpoint.type) {
          case "JWT":
            test(
              "Checking endpoint rejects forged JWT: " + endpoint.url,
              async (done) => {
                const fakeToken = nonToken("SecurityChecker", "notthesecret", null);
                if (endpoint.method === "get") {
                  const response = await request(app)
                    .get(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + fakeToken);
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "post") {
                  const response = await request(app)
                    .post(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + fakeToken);
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "put") {
                  const response = await request(app)
                    .put(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + fakeToken);
                  expect(response.status).toBe(401);
                }
                done();
              },
              10000
            );

            test(
              "Checking endpoint rejects expired JWT: " + endpoint.url,
              async (done) => {
                const expToken = nonToken("SecurityChecker", null, true);
                if (endpoint.method === "get") {
                  const response = await request(app)
                    .get(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + expToken);
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "post") {
                  const response = await request(app)
                    .post(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + expToken);
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "put") {
                  const response = await request(app)
                    .put(encodeURI(endpoint.url))
                    .set("Authorization", "JWT " + expToken);
                  expect(response.status).toBe(401);
                }
                done();
              },
              10000
            );
            break;
          default:
            const securegroup = keyset.filter((x) => x.org === endpoint.type);
            let key = "unknown";
            if (securegroup.length > 0) {
              key = securegroup[0].key;
            }

            test(
              "Checking endpoint rejects invalid API Key: " + endpoint.url,
              async (done) => {
                if (endpoint.method === "get") {
                  const response = await request(app).get(encodeURI(endpoint.url)).set("Authorization", "notthesecret");
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "post") {
                  const response = await request(app).post(encodeURI(endpoint.url)).set("Authorization", "notthesecret");
                  expect(response.status).toBe(401);
                } else if (endpoint.method === "put") {
                  const response = await request(app).put(encodeURI(endpoint.url)).set("Authorization", "notthesecret");
                  expect(response.status).toBe(401);
                }
                done();
              },
              10000
            );
            break;
        }
      }
    });
  });
} else {
  describe("Test the root path", () => {
    test("It should check the invalid endpoint as a standard Health Check", async (done) => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      done();
    }, 10000);
  });
}

afterAll((done) => {
  done();
});
