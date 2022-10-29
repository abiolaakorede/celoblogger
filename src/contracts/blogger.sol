// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract CeloBlogger {
    uint256 internal postCount = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Post {
        address payable owner;
        string author;
        string image;
        string title;
        string content;
        uint256 tippers;
        uint256 likes;
    }
    mapping(uint256 => Post) internal posts;
    mapping(uint256 => mapping(address => bool)) private liked;


    // To prevent unauthorized persons
    modifier isPostOwner(address _address) {
        require(msg.sender == _address, "NOT_THE_OWNER");
        _;
    }

    /**
        * @dev allow users to create a post
        * @notice input data needs to contain only valid/non-empty values
     */
    function createPost(
        string calldata _author,
        string calldata _image,
        string calldata _title,
        string calldata _content
    ) public {
        require(bytes(_author).length > 0, "Empty author");
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_title).length > 0, "Empty title");
        require(bytes(_content).length > 0, "Empty content");
        posts[postCount] = Post(
            payable(msg.sender),
            _author,
            _image,
            _title,
            _content,
            0,
            0
        );
        postCount++;
    }

    function displayPost(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        return (
            posts[_index].owner,
            posts[_index].author,
            posts[_index].image,
            posts[_index].title,
            posts[_index].content,
            posts[_index].tippers,
            posts[_index].likes
        );
    }


    /**
        * @dev allow users to tip/donate to an author of a post
     */
    function tipPost(uint256 _index, uint256 _donation) public payable {
        Post storage currentPost = posts[_index];
        require(currentPost.owner != msg.sender, "You can't tip yourself");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentPost.owner,
                _donation
            ),
            "Transfer failed."
        );
        currentPost.tippers++;
    }

    // Edit Post
    function editPost(
        uint256 _index,
        string memory _title,
        string memory _content,
        string memory _image
    ) public isPostOwner(posts[_index].owner) {
        posts[_index].title = _title;
        posts[_index].content = _content;
        posts[_index].image = _image;
    }

    /**
        * @dev allow users to like or dislike a post
        * @notice the default state changes will be liking the post. However, users can call the function again to dislike
     */
    function likeOrDislikePost(uint256 _index) public {
        require(posts[_index].owner != address(0), "Query of nonexistent post");
        if (!liked[_index][msg.sender]) {
            liked[_index][msg.sender] = true;
            posts[_index].likes++;
        } else {
            liked[_index][msg.sender] = false;
            posts[_index].likes--;
        }
    }
    function deletePost(uint256 _index) public isPostOwner(posts[_index].owner) {
        delete posts[_index];
    }

    function getPostCount() public view returns (uint256) {
        return (postCount);
    }
}
