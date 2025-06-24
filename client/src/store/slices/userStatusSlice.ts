import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserStatus, HousingStatus, SoldierType, ServiceType } from '../../types/user-status';

const initialState: UserStatus = {
  soldierType: SoldierType.LONE_SOLDIER,
  service: {
    enlistmentDate: undefined,
    dutyEndDate: undefined,
    serviceType: ServiceType.MANDATORY,
  },
  housing: {
    housingStatus: HousingStatus.NO_HOUSE,
    idfRentAssistance: false,
  },
};

export const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState,
  reducers: {
    updateHousingStatus: (state, action: PayloadAction<HousingStatus>) => {
      state.housing.housingStatus = action.payload;
    },
    updateSoldierType: (state, action: PayloadAction<SoldierType>) => {
      state.soldierType = action.payload;
    },
    updateServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.service.serviceType = action.payload;
    },
    updateEnlistmentDate: (state, action: PayloadAction<number>) => {
      state.service.enlistmentDate = action.payload;
    },
    updateDutyEndDate: (state, action: PayloadAction<number | undefined>) => {
      state.service.dutyEndDate = action.payload;
    },
    updateIdfRentAssistance: (state, action: PayloadAction<boolean>) => {
      state.housing.idfRentAssistance = action.payload;
    },
    resetUserStatus: () => initialState,
  },
});

export const {
  updateHousingStatus,
  updateSoldierType,
  updateServiceType,
  updateEnlistmentDate,
  updateDutyEndDate,
  updateIdfRentAssistance,
  resetUserStatus,
} = userStatusSlice.actions;

export default userStatusSlice.reducer;
