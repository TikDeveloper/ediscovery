import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from 'utils/axios';

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
};

type AuthStateType = {
  isLoggedIn: boolean;
  token?: string;
  data: UserData | null;
  loading: boolean;
};

export type LoginRequestArgs = {
  email: string;
  password: string;
};

export type RegisterRequestArgs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ResetPasswordArgs = {
  email: string;
};

export type SetNewPasswordArgs = {
  newPassword: string;
  token: string;
};

const initialState: AuthStateType = {
  isLoggedIn: false,
  token: undefined,
  data: null,
  loading: false
};

// Login Request //
export const loginRequest = createAsyncThunk(
  'auth/login',
  async (args: LoginRequestArgs, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('email', args.email);
    formData.append('password', args.password);
    try {
      const response = await api.post('/login/', formData);
      const { accses_token } = response.data;
      api.defaults.headers.common['Authorization'] = `Bearer ${accses_token}`;
      toast.success('Բարի գալուստ Gurubook');

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.error);
      return rejectWithValue(err.response.data);
    }
  }
);

// Registration Request //
export const registerRequest = createAsyncThunk(
  'auth/register',
  async (args: RegisterRequestArgs, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('first_name', args.firstName);
    formData.append('last_name', args.lastName);
    formData.append('email', args.email);
    formData.append('password', args.password);
    try {
      const response = await api.post('/register/', formData);
      const { accses_token } = response.data;
      api.defaults.headers.common['Authorization'] = `Bearer ${accses_token}`;
      toast.success('Ձեր անձնական հաշիվը հաջողությամբ ստեղծվել է');

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.error);
      return rejectWithValue(err.response.data);
    }
  }
);

// Reset Password Request //
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetPassword',
  async (args: ResetPasswordArgs, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('email', args.email);
    try {
      const response = await api.post('/forgot_password/', formData);

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.error);
      return rejectWithValue(err.response.data);
    }
  }
);

// Set New Password Request //
export const setNewPasswordRequest = createAsyncThunk(
  'auth/setNewPassword',
  async (args: SetNewPasswordArgs, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('new_password', args.newPassword);
    formData.append('token', args.token);
    try {
      const response = await api.post('/forgot_password/new_password/', formData);

      return response.data;
    } catch (err: any) {
      toast.error(err.response.data.error);
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    testFakeLogin(state) {
      state.isLoggedIn = true;
    }
    // logout(state) {
    //   state.isLoggedIn = false;
    //   state.token = null;
    //   state.data = null;
    //   state.loading = false;
    //   api.defaults.headers.Authorization = null;
    // }
  },
  extraReducers: (builder) => {
    builder

      // Login //
      .addCase(loginRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = payload.accses_token;
        state.data = {
          firstName: payload.first_name,
          lastName: payload.last_name,
          email: payload.email
        };
      })
      .addCase(loginRequest.rejected, (state) => {
        state.loading = false;
        // console.error(payload, 'Error Responce Login');
      })

      // Registration //
      .addCase(registerRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = payload.accses_token;
        state.data = {
          firstName: payload.first_name,
          lastName: payload.last_name,
          email: payload.email
        };
      })
      .addCase(registerRequest.rejected, (state) => {
        state.loading = false;
        // console.error(payload, 'Error Responce Registration');
      })

      // Reset Password //
      .addCase(resetPasswordRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordRequest.rejected, (state) => {
        state.loading = false;
        // console.error(payload, 'Error Responce Reset Password');
      })

      // Set New Password //
      .addCase(setNewPasswordRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(setNewPasswordRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        console.log(payload);
      })
      .addCase(setNewPasswordRequest.rejected, (state) => {
        state.loading = false;
        // console.error(payload, 'Error Responce Set New Password');
      });
  }
});

export const { testFakeLogin } = authSlice.actions;

export default authSlice.reducer;