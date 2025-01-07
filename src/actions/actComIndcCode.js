import IndcCodeService from '../services/ComIndcCode.service';

// 서비스 함수들
export const convert = async () => {
  try {
    const res = await IndcCodeService.convert();
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const selectIndc = async (newData) => {
  try {
    const res = await IndcCodeService.getAll(newData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const saveIndc = async (newData) => {
  try {
    const res = await IndcCodeService.saveIndc(newData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateIndc = async (newData) => {
  try {
    const res = await IndcCodeService.updateIndc(newData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteIndc = async (newData) => {
  try {
    const res = await IndcCodeService.deleteIndc(newData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

