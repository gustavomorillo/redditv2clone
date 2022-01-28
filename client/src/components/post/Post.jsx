import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post, setRefetch }) {
  const [like, setLike] = useState(post.likes.length);

  const [user, setUser] = useState({});
  const [seconds, setSeconds] = useState(
    60 - moment().diff(post.countDown, "seconds")
  );
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [secondsMultiplier, setSecondsMultiplier] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(like + 1);
    setSeconds(seconds + 30);
    setSecondsMultiplier(secondsMultiplier + 1);
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      setSeconds(
        60 - moment().diff(post.countDown, "seconds") + secondsMultiplier * 30
      );
      // Example:
      // if time is 8:00:30 and post was save at 8:00:20
      // the diff is 10 seconds and should show 50 seconds remaining
      // the result would be 60 - moment().diff(post.cou.....
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    if (seconds <= 0) {
      try {
        axios.delete("/posts/" + post._id);
        setRefetch(true);
      } catch (err) {}
    }
  }, [seconds]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{seconds}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
