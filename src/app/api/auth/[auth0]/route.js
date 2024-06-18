// app/auth/[auth0]/router.js
import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import connect from "@/utils/db";
import user from "@/models/user";

export const GET = handleAuth();

const afterCallback = async (req, res, session, state) => {
  await connect();

  const { user } = session;
  const existingUser = await user.findOne({ email: user.email });

  if (!existingUser) {
    await user.create({
      nickName: user.nickname,
      firstName: user.given_name || '',
      lastName: user.family_name || '',
      email: user.email,
      profile_image: user.picture,
      profession: '',
      bio: '',
      socialProfiles: [],
    });
  }

  return session;
};

