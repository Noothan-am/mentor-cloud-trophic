import { useNavigate } from "react-router-dom";
const style = require("../styles/leaderboard.module.css").default;

export default function Leaderboard({ user, count }: any) {
  const navigation = useNavigate();

  const handleOnclickLeaderboard = () => {
    // navigation(`/all-transactions`);
  };

  return (
    <>
      <button
        onClick={handleOnclickLeaderboard}
        className={style["leaderboard-single-person"]}
      >
        <div className={style["leaderboard-number"]}>{count}</div>
        <div className={style["leaderboard-name"]}>{user.name}</div>
      </button>
    </>
  );
}
