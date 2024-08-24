"use client";

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
      if (user) {
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
      }
    };

    checkIfFollowing();
  }, [user, userData.email]);

  const handleFollow = async () => {
    if (!user) {
      // Optionally show a message or redirect if user is not authenticated
      router.push("/api/auth/login");
      return;
    }

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
    if (!user) {
      // Optionally show a message or redirect if user is not authenticated
      router.push("/api/auth/login");
      return;
    }

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
    <div key={userData._id} className="block">
      <div className="relative h-72 bg-white border-black/15 dark:bg-gray-950 rounded-lg w-96 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition mt-3 duration-300 ease-in-out shadow-md dark:border-white/35 border-2 p-6 flex flex-col">
        <div className="flex items-center space-x-4">
          <img
            src={userData.profile_image}
            alt={`${userData.firstName} ${userData.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userData.nickName}{" "}
              {userData?.email === user?.email ? "(you)" : ""}
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
        {user?.email === userData.email ? (
          <button
            onClick={() => {
              router.push("/dashboard");
            }}
            className="border-2 rounded-lg p-3 text-black dark:text-white"
          >
            Dashboard
          </button>
        ) : (
          <div className="mt-4 flex space-x-2 dark:text-white text-black">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    router.push(`/${userData.email}`);
                  }}
                  className="w-full border-2 border-black/10 dark:border-white dark:text-white text-black"
                >
                  Profile
                </Button>
                <Button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className="w-full border-2 border-black/10 dark:border-white dark:text-white text-black"
                >
                  {isFollowing ? "Stop Follow" : "Follow"}
                </Button>
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Please log in to follow or view profiles.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
