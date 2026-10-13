import { useDispatch, useSelector } from 'react-redux';
import { setModalOpen, resetModalState } from '@/redux/slices/excelBulkEditSlice';

export function useExcelBulkEditModal() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.excelBulkEdit);

  return {
    ...state,
    openModal: () => dispatch(setModalOpen(true)),
    closeModal: () => {
      dispatch(resetModalState());
      dispatch(setModalOpen(false));
    },
  };
}
