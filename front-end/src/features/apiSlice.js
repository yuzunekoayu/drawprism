import { nanoid } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_ENV !== 'production'
        ? `${process.env.REACT_APP_DEV_ENDPOINT}`
        : `${process.env.REACT_APP_PROD_ENDPOINT}`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/api/user',
      providesTags: ['User'],
    }),
    signUpUser: builder.mutation({
      query: (user) => ({
        url: '/api/user',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    signInUser: builder.mutation({
      query: (user) => ({
        url: '/api/user',
        method: 'PATCH',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    logOutUser: builder.mutation({
      query: (userUuid) => ({
        url: `/api/user/${userUuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getSetting: builder.query({
      query: (roomUuid) => ({
        url: '/api/setting',
        method: 'GET',
        params: { room: roomUuid },
      }),
      providesTags: ['Setting'],
    }),
    createSetting: builder.mutation({
      query: (ownerUuid) => ({
        url: 'api/setting',
        method: 'POST',
        body: { ownerUuid },
      }),
      invalidatesTags: ['Setting'],
    }),
    updateSetting: builder.mutation({
      query: (updates) => ({
        url: '/api/setting',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Setting'],
    }),
    deleteSetting: builder.mutation({
      query: (roomUuid) => ({
        url: `/api/setting/${roomUuid}`,
        method: 'DELETE',
      }),
    }),
    getAllChatLog: builder.query({
      query: (roomUuid) => `/api/chat_log/${roomUuid}`,
      transformResponse: (response) => response.map((res) => ({ id: nanoid(), ...res })),
      providesTags: ['ChatLog'],
    }),
    getAllParticipate: builder.query({
      query: (roomUuid) => `/api/participate/${roomUuid}`,
      transformResponse: (response) => response.map((res) => ({ id: nanoid(), ...res })),
      providesTags: ['Participate'],
    }),
    updateParticipate: builder.mutation({
      query: (updates) => ({
        url: `/api/participate/${updates.roomUuid}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Participate'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useSignUpUserMutation,
  useSignInUserMutation,
  useLogOutUserMutation,
  useGetSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useLazyGetAllChatLogQuery,
  useGetAllParticipateQuery,
  useUpdateParticipateMutation,
} = apiSlice;
