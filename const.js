const z = require("zod");

const NET_FOLDERS = {
  main: "main",
  test: "test",
};
const NODES = {
  main: "https://sync-mainnet.vechain.org",
  test: "https://sync-testnet.vechain.org",
};

const additionalSchema = z.object({
  website: z.string().url().optional(),
  whitePaper: z.string().url().optional(),
  link: z
    .object({
      twitter: z.string().url().optional(),
      telegram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      medium: z.string().url().optional(),
      github: z.string().url().optional(),
      slack: z.string().url().optional(),
    })
    .optional(),
  crossChainProvider: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .optional(),
});

module.exports = {
  NETS: NET_FOLDERS,
  NODES,
  additionalSchema,
};
