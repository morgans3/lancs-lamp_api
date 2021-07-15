const region = process.env.AWSREGION || "eu-west-2";
const access = process.env.AWSPROFILE || "Dev";
const pgdb = process.env.PGDATABASE || "localhost";
const pgport = process.env.PGPORT || "5432";
const credentials = require("../_credentials/credentials");

var AWS = require("aws-sdk");
AWS.config.region = region;
var creds = new AWS.Credentials({
  accessKeyId: credentials.aws_secret_id,
  secretAccessKey: credentials.aws_secret_key,
});
AWS.config.credentials = creds;

module.exports.settings = {
  awsregion: region,
  awsenvironment: access,
  accessKeyId: credentials.aws_secret_id,
  secretAccessKey: credentials.aws_secret_key,
  AWS: AWS,
  pgdatabase: pgdb,
  pgport: pgport,
  postgres_un: process.env.POSTGRES_UN,
  postgres_pw: process.env.POSTGRES_PW,
  AWS_BUCKET_NAME_LAMP: process.env.BUCKETNAME + "-" + access.toLowerCase(),
};

const config = this.settings;
const pg = require("pg");
const types = pg.types;
const Pool = pg.Pool;
const pool = new Pool({
  user: config.postgres_un,
  host: config.pgdatabase,
  database: "postgres",
  password: config.postgres_pw,
  // @ts-ignore
  port: config.pgport,
});
// @ts-ignore
types.setTypeParser(types.builtins.DATE, (stringValue) => {
  return new Date(stringValue);
});

module.exports.pool = pool;
module.exports.types = types;
module.exports.AWS = AWS;
