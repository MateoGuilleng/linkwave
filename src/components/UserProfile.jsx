import Link from "next/link";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

const UserProfile = ({ user }) => {
  const router = useRouter();
  return (
    <div key={user._id} href={`/${user.email}`} className="block">
      <div className="relative h-72 bg-black rounded-lg w-80 overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition mt-3 duration-300 ease-in-out shadow-md dark:bg-black border-white/35 border-2 p-6 flex flex-col">
        <div className="flex items-center space-x-4">
          <img
            src={user.profile_image}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.nickName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Profession: {user.profession}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300 flex-grow">
          Bio:{" "}
          {user?.bio?.length > 100
            ? `${user.bio.substring(0, 100)}...`
            : user.bio}
        </p>
        <div className="mt-4 flex space-x-2">
          <Button
            onClick={() => {
              router.push(user.email);
            }}
            className="w-full border-2 border-white"
          >
            Profile
          </Button>
          <Button className="w-full border-2 border-white">Follow</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
