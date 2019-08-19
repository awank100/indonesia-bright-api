export enum EnumGender {
  male = 'male',
  female = 'female'
}

export enum EnumReligion {
  islam = 'Islam',
  katolik = 'Katolik',
  protestan = 'Protestan',
  hindu = 'Hindu',
  budha = 'Budha',
  konghucu = 'Konghucu'
}

export enum EnumMarriageStat {
  married = 'Menikah',
  notYet = 'Belum Menikah',
  divorce = 'Duda/Janda'
}

export enum EnumEducationLevel {
  sd = 'SD',
  smp = 'SMP',
  sma = 'SMA/SMK',
  diploma1 = 'Diploma 1',
  diploma2 = 'Diploma 2',
  diploma3 = 'Diploma 3',
  sarjana = 'Sarjana',
  magister = 'Magister',
  doctor = 'Doctor'
}

export const genderList = [EnumGender.male, EnumGender.female]

export const religionList = [
  EnumReligion.islam,
  EnumReligion.katolik,
  EnumReligion.protestan,
  EnumReligion.hindu,
  EnumReligion.budha,
  EnumReligion.konghucu
]

export const marriageStatList = [
  EnumMarriageStat.notYet,
  EnumMarriageStat.married,
  EnumMarriageStat.divorce
]

export const educationLevelList = [
  EnumEducationLevel.sd,
  EnumEducationLevel.smp,
  EnumEducationLevel.sma,
  EnumEducationLevel.diploma1,
  EnumEducationLevel.diploma2,
  EnumEducationLevel.diploma3,
  EnumEducationLevel.sarjana,
  EnumEducationLevel.magister,
  EnumEducationLevel.doctor
]
