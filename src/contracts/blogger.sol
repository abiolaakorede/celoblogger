// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract CeloBlogger {
    uint internal postCount = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Post {
        address payable owner;
        string author;
        string image;
        string title;
        string content;
        uint tippers;
    }
    mapping (uint => Post) internal posts;

    function createPost(
        string memory _author,
        string memory _image,
        string memory _title,
        string memory _content
    ) public {
        posts[postCount] = Post(
            payable(msg.sender),
            _author,
            _image,
            _title,
            _content,
            0
        );
        postCount++;
        }

    function displayPost(uint _index) public view returns (
        address payable,
        string memory,
        string memory,
        string memory,
        string memory,
        uint
    ) {
        return (
            posts[_index].owner,
            posts[_index].author,
            posts[_index].image,
            posts[_index].title,
            posts[_index].content,
            posts[_index].tippers
        );
    }


    function tipPost(uint _index, uint _donation) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            posts[_index].owner,
            _donation
          ),
          "Transfer failed."
        );
        posts[_index].tippers++;
    }


    function getPostCount() public view returns (uint) {
        return (postCount);
    }

}