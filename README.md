# VeChain Token-registry - Submit Form

Token-registry is a platform where you can submit the token. Token-registry will provide a list to application includes the token name, symbol, description, image and contract address in Mainnet or Testnet. If you wish your token on the list, you can create a pull request to submit token.

## Requirements 
1. Make sure the contract address is correct (main/test)
2. Token image is required
3. Folder name must be the same as the contract address 
4. Clear and simple description 
5. Comply with directory & contents rules

## Getting Ready for Submission
### Fork Token-registry
Forking a repository allows you to create your token details and send a pull request for the maintainers to review and merge into *Token-registry*.
### Generate Token Information
1. Create a directory in [main](tokens/main) /[test](tokens/test)/both and named the directory with **Contract address**.

> Contract address start with **0x + 40 characters and must be lower case**, E.g., `0x0000000000000000000000000000456e65726779`.

```
├── main 
│   └── 0x0000000000000000000000000000456e65726779 //Contract address
│       ├── token.png
│       ├── info.json
│       └── additional.json
```


2. Import your token image into the directory and named it `token`.**(Image must be `png` format, `transparent background`and `256 x 256` pixel size)**

3. Generate a **info.json** file includes token details.


```
    {
        "name": "VeThor",
        "symbol": "VTHO",
        "decimals":18,
        "desc": "Represents the underlying cost of using VeChainThor"
    }
```

4. Generate an **additional.json** file includes following details. 

```
{
  "website":"https://www.example.com/", 
  "links":{
      "twitter":"https://twitter.com/example",      
      "telegram":"https://t.me/example",
      "facebook":"https://www.facebook.com",
      "medium":"https://medium.com/@example",
      "github":"https://github.com/example",
      "slack":"https://example.slack.com/"
    },
  "whitePaper":"https://www.example.com/whitepaper/"
}

```   
> Only Twitter / Telegram / Facebook / Medium / Github / Slack are supported

### Making a Pull Request / Submit Your token
After [Create a pull request](https://help.github.com/en/articles/creating-a-pull-request), your pull request will be reviewed by maintainers. Once the review is completed, your token will be merged into the base branch.

## Get Approved token list

1. Get tokens information

`https://vechain.github.io/token-registry/{main|test}.json`

2. Get token icon

`https://vechain.github.io/token-registry/assets/{item.icon}`
