import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User, HousingStatus, SoldierType, ServiceType } from '../../types/user-status';

const initialUserState: User = {
  personal: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  },
  general: {
    birthDate: undefined,
    country: '',
    city: '',
    soldierType: undefined,
  },
  aliyah: {
    aliyahYear: undefined,
    aliyahCountry: '',
    isOleh: false,
    parentsAbroad: '',
  },
  army: {
    enlistDate: undefined,
    releaseDate: undefined,
    serviceType: undefined,
    monthsServed: 0,
    activityLevel: undefined,
    isCombat: false,
  },
  housing: {
    housingStatus: undefined,
    receivesArmyAssistance: false,
    distanceToBase: 0,
    currentHousing: '',
  },
};

export const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState: initialUserState,
  reducers: {
    setHousingStatus: (state, action: PayloadAction<HousingStatus>) => {
      state.housing.housingStatus = action.payload;
    },
    setSoldierType: (state, action: PayloadAction<SoldierType>) => {
      state.general.soldierType = action.payload;
    },
    setServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.army.serviceType = action.payload;
    },
    setEnlistDate: (state, action: PayloadAction<number>) => {
      state.army.enlistDate = new Date(action.payload);
    },
    setReleaseDate: (state, action: PayloadAction<number | undefined>) => {
      state.army.releaseDate = action.payload !== undefined ? new Date(action.payload) : undefined;
    },
    setReceivesArmyAssistance: (state, action: PayloadAction<boolean>) => {
      state.housing.receivesArmyAssistance = action.payload;
    },
    resetUserStatus: () => initialUserState,
  },
});

export const {
  setHousingStatus,
  setSoldierType,
  setServiceType,
  setEnlistDate,
  setReleaseDate,
  setReceivesArmyAssistance,
  resetUserStatus,
} = userStatusSlice.actions;

export default userStatusSlice.reducer;
