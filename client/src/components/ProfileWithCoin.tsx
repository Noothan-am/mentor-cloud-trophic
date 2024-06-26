import React, { useEffect, useState } from "react";
const coin = require("../assets/images/coin.png");
const styles = require("../styles/profile-coin.module.css").default;
// const img = require("../assets/images/Indu-Kanth.png").default;
function ProfileWithCoin({ userDetails }: any) {
  const { image, name, total_coins } = userDetails;

  return (
    <>
      <div className={styles["profile"]}>
        <div className={styles["profile__picture"]}>
          <img
            src={
              userDetails.image.data
                ? `data:image/jpeg;base64,${userDetails.image.data}`
                : require("../assets/images/" + image)
            }
            alt="profile-icon"
          />
        </div>

        <div className={styles["profile__content"]}>
          <div className={styles["profile__content-name"]}>{name}</div>
          <div className={styles["profile__content-coins"]}>
            <div className={styles["profile__content-coins-image"]}>
              <img src={coin} alt="" />
            </div>
            <div className={styles["profile__content-coins-count"]}>
              {/* {total_coins < 10 ? "0" + total_coins : total_coins} */}
              {total_coins}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileWithCoin;
