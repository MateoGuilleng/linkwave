// components/userProfile.jsx

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

const UserProfile = ({ userData }) => {
  const { user } = useUser();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const response = await fetch(
          `/api/${userData.email}/${user.email}/follows`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to check if user ${user.email} is following ${userData.email}`
          );
        }
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error(
          `Error checking follow status for ${user.email} and ${userData.email}:`,
          error
        );
      }
    };

    if (user) {
      checkIfFollowing();
    }
  }, [user, userData.email]);

  const handleFollow = async () => {
    try {
      const response = await fetch(
        `/api/${userData.email}/${user.email}/follows`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update follow status for ${user.email} and ${userData.email}`
        );
      }

      const updatedUserData = await response.json();
      console.log(
        `Follow status updated for ${user.email} and ${userData.email}`,
        updatedUserData
      );

      setIsFollowing(true); // Set follow status to true
    } catch (error) {
      console.error(
        `Error updating follow status for ${user.email} and ${userData.email}:`,
        error
      );
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(
        `/api/${userData.email}/${user.email}/follows`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update unfollow status for ${user.email} and ${userData.email}`
        );
      }

      const updatedUserData = await response.json();
      console.log(
        `Unfollow status updated for ${user.email} and ${userData.email}`,
        updatedUserData
      );

      setIsFollowing(false); // Set follow status to false
    } catch (error) {
      console.error(
        `Error updating unfollow status for ${user.email} and ${userData.email}:`,
        error
      );
    }
  };

  return (
    <div key={userData._id} href={`/${userData.email}`} className="block">
      <div className="relative h-72 bg-black rounded-lg w-80 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition mt-3 duration-300 ease-in-out shadow-md dark:bg-black border-white/35 border-2 p-6 flex flex-col">
        <div className="flex items-center space-x-4">
          <img
            src={userData.profile_image}
            alt={`${userData.firstName} ${userData.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userData.nickName}{" "}
              {userData?.email == user?.email ? "(you)" : ""}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Profession: {userData.profession}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userData.email}
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300 flex-grow">
          Bio:{" "}
          {userData?.bio?.length > 100
            ? `${userData.bio.substring(0, 100)}...`
            : userData.bio}
        </p>
        {user?.email == userData.email ? (
          <button
            onClick={() => {
              router.push("/dashboard");
            }}
            className="border-2 rounded-lg p-3"
          >
            {" "}
            Dashboard{" "}
          </button>
        ) : (
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={() => {
                router.push(userData.email);
              }}
              className="w-full border-2 border-white"
            >
              Profile
            </Button>
            <Button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className="w-full border-2 border-white"
            >
              {isFollowing ? "Stop Follow" : "Follow"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
