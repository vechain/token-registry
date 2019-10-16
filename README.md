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
1. Create a directory in [main](tokens/main) or [test](tokens/test) and named the directory with **Contract address**.

> Contract address start with **0x + 40 characters and must be lower case**, E.g., `0x0000000000000000000000000000456e65726779`.

```
├── main 
│   └── 0x0000000000000000000000000000456e65726779
│       ├── token.png
│       └── info.json
```


2. Import your token image into the directory and named it `token`.**(Image must be `png` format, `transparent background`and `256 x 256` pixel size)**

3. Generate a info.json file includes token details.


```
    {
        "name": "VeThor",
        "symbol": "VTHO",
        "decimals":18,
        "desc": "Represents the underlying cost of using VeChainThor"
    }
```
    
### Making a Pull Request / Submit Your token
After [Create a pull request](https://help.github.com/en/articles/creating-a-pull-request), your pull request will be reviewed by maintainers. Once the review is completed, your token will be merged into the base branch.
