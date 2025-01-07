import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useRef 
} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './IndustryGrid.css';
import IndcCodeService from './services/ComIndcCode.service'
import * as indcActions from './actions/actComIndcCode';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}


  const getIndcCodeAll = async() => {
   try {
    const response = await IndcCodeService.getAll({});
    console.log("Try Calling IndcAll from front")
    return response.data;    
   } catch (error) {
    console.log("Cannot find getIndcCodeAll:" + error)
    throw error;
   }
  }

  const columns = [
    {
      field: 'indc_code',
      headerName: 'Code Nbr',
      flex: 1,
     }
    ,
    {
      field: 'indc_ksic',
      headerName: 'KSIC Code',
      flex: 1,
      },
    {
      field: 'indc_kiwa',
      headerName: 'KIWA Code',
      flex: 1,
    },
    {
      field: 'indc_italy',
      headerName: 'ITALY Code',
      flex: 1,
    },
    {
      field: 'indc_desc',
      headerName: 'Description',
      flex: 6,
    }
  ];
  const IndustryManager = () => {
    const gridRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [ksicError, setKsicError] = useState(true);
    const [kiwaError, setKiwaError] = useState(false);
    const [italyError, setItalyError] = useState(false);
    const validateNumber = (value) => {
      return /^[\d,\s]*$/.test(value);
    };
    
    const [snackbar, setSnackbar] = useState({ 
      open: false,
      message: '',
      severity: 'info',
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [infoIndc, setInfoIndc] = useState({
        input_indc_desc: '',
        indc_nat: '',
        indc_ksic: '',
        indc_kiwa: '',
        indc_italy: '',
        indc_desc: '',
        indc_rmk: '',
    });
    const initialFormState = {
      indc_nat: 'KR',
      indc_ksic: '',
      indc_kiwa: '',
      indc_italy: '',
      indc_desc: '',
      indc_rmk: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleReset = () => {
      setFormData(initialFormState);
      setSelectedRow(null);
    };
    
    const {
      input_indc_desc,
      indc_nat,
      indc_ksic,
      indc_kiwa,
      indc_italy,
      indc_desc,
      indc_rmk,
    } = formData;

    const [rowData, setRowData] = useState([]);
  
    const saveIndc = async (newData) => {
    console.log("newData====>",newData);
      try {
        
        const result = await IndcCodeService.saveIndc(newData);
        return result;
      } catch (error) {
        console.error("저장 실패:", error);
      }
    };
  
    const updateIndc = async (newData) => {
      console.log("updatingData====>",newData);
            try {

              const result = await IndcCodeService.updateIndc(newData);
              return result;
            } catch (error) {
              console.error("갱신 실패:", error);
            }
    };

    const deleteIndc = async (newData) => {
      console.log("deleteingData====>", newData);
      try {

        const result = await IndcCodeService.deleteIndc(newData);
        return result;
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }


    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getIndcCodeAll();
          setRowData(data);
        } catch (error) {
          console.error("데이터 불러오기 실패:", error);
        }
      };

      fetchData();
}, []);

    const defaultColDef = useMemo(() => ({
      sortable: true,
      filter: false,
  }));

  

  //----------Click Event(create, update, delete, )----------//

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption('quickFilterText', query);
    }
  };
  

  const onRowClicked = (params) => {
    console.log("params" ,params)
    setSelectedRow(params.data);
    setFormData({
      indc_ksic: params.data.indc_ksic || '',
      indc_kiwa: params.data.indc_kiwa || '',
      indc_italy: params.data.indc_italy || '',
      indc_desc: params.data.indc_desc || '',
      indc_rmk: params.data.indc_rmk || ''
    });
  };

  const onClickSave = async () => {
    try {
      if (!formData.indc_ksic) {
        setSnackbar({
          open: true,
          message: 'KSIC 코드는 필수 입력 사항입니다.',
          severity: 'error'
        });
        return;
      } else {
        setKsicError(false); // 유효한 입력이면 에러 상태 해제
      }
      
      const newData = {
        indc_nat: 'KR',
        indc_code: "" ,
        indc_ksic: formData.indc_ksic,
        indc_kiwa: formData.indc_kiwa,
        indc_italy: formData.indc_italy,
        indc_desc: formData.indc_desc,
        indc_rmk: formData.indc_rmk
      };
      
      const isDuplicate = rowData.some(row => row.indc_ksic === newData.indc_ksic);

      if (isDuplicate) {
        setSnackbar({
          open: true,
          message: '중복되는 KSIC 코드가 이미 존재합니다. 다른 코드로 입력해주세요.',
          severity: 'error'
        });
        return;
      }

      const result = await saveIndc(newData);
      if (result) {
        setSnackbar({
          open: true,
          message: '데이터가 성공적으로 저장되었습니다.',
          severity: 'success'
        });

        // 데이터 새로고침
        const updatedData = await getIndcCodeAll();
        
        setRowData(updatedData);
        handleReset();
        
        return setRowData(updatedData);
      }
    } catch (error) {
      console.error("생성 실패:", error);
      console.error("생성 실패:", error);
    
      setSnackbar({
      open: true,
      message: '데이터 저장 중 오류가 발생했습니다.',
      severity: 'error'
    });
    }
  };
  
  const onClickUpdate = async () => {
    console.log(selectedRow)
    try {
      const newData = {
        indc_nat: 'KR',
        indc_code: selectedRow.indc_code,
        indc_ksic: formData.indc_ksic,
        indc_kiwa: formData.indc_kiwa,
        indc_italy: formData.indc_italy,
        indc_desc: formData.indc_desc,
        indc_rmk: formData.indc_rmk
      };
      
      const result = await updateIndc(newData);
      if (result) {
        setSnackbar({
          open: true,
          message: '데이터를 업데이트트하였습니다.',
          severity: 'success'
        });

        // 데이터 새로고침
        const updatedData = await getIndcCodeAll();
        setRowData(updatedData);
        handleReset();
      }
    } catch (error) {
      console.error("갱신 실패:", error);
    };
  };
  
  const onClickDelete = async () => {
    setOpenDeleteDialog(true);
    console.log("DeleteButtonClicked", selectedRow);
  };

  const handleDeleteConfirm = async () => {
    try {
      const newData = {
        indc_nat: 'KR',
        indc_code: selectedRow.indc_code,
        indc_ksic: formData.indc_ksic,
        indc_kiwa: formData.indc_kiwa,
        indc_italy: formData.indc_italy,
        indc_desc: formData.indc_desc,
        indc_rmk: formData.indc_rmk
      };
  
      const result = await deleteIndc(newData);
      if (result) {
        setSnackbar({
          open: true,
          message: '데이터를 삭제하였습니다.',
          severity: 'success'
        });
  
        const updatedData = await getIndcCodeAll();
        setRowData(updatedData);
        handleReset();
      }
    } catch (error) {
      console.error("삭제 실패", error);
      setSnackbar({
        open: true,
        message: '데이터 삭제 중 오류가 발생했습니다.',
        severity: 'error'
      });
    }
    setOpenDeleteDialog(false);
  };    


  //-----------------------------UI---------------------------//


  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box  sx={{
        width: 1000,
        height: 1000,
        borderRadius: 1,
        marginTop: '20px'
              }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color='primary' variant="h4" gutterBottom>
            산업분류 관리
            </Typography>
            <Box
              style={{ display: 'flex', float: 'right', width: '40%', marginBottom: 10 }}>
                <TextField
                  name='input_indc_desc'
                  label='Description'
                  value={input_indc_desc}
                  onChange={handleSearch}
                  style={{ width: 400, marginRight: 10 }}
                  size='small'
                  fullWidth
                />
                <Button
                variant='contained'
                color='primary'
                onClick={handleSearch}
                >
                  SEARCH
                </Button>
            </Box>
        </Box>
        <Box className='ag-theme-balham' style={{ width: '100%', height: 520, marginBottom: 20 }}>
          <AgGridReact
            ref={gridRef} 
            headerHeight={40}
            rowHeight={30}
            rowData={rowData}
            columnDefs={columns} 
            defaultColDef={defaultColDef} 
            rowSelection='single'
            pagination={true}
            paginationPageSize={20}
            onRowClicked={onRowClicked}
            quickFilterText={searchQuery}
            enableQuickFilter={true}
          />
        </Box>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Delete Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Would you delete this data?
              <p>※Once confirmed, it cannot be undone.</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Confirm</Button>
          </DialogActions>
        </Dialog>



        <Box sx={{
          width: 980,
          height: 230,
          padding: '10px',
          borderRadius: 1,}}
          style={{ border: '1px solid gray', borderRadius: 4 }}>
          <form autoComplete='off'>
            <Box style={{ marginBottom: 30 }}>
              <Box
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 15,
              }}>
              
              <TextField
                id="indc_ksic"
                label="KSIC Code*"
                variant="outlined"
                size='small'
                value={formData.indc_ksic}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setFormData({ ...formData, indc_ksic: value });
                    setKsicError(value === '');
                  } else {
                    setKsicError(true);
                  }
                }}
                error={ksicError}
                helperText={ksicError ? (formData.indc_ksic === '' ? "Required Input." : "Only Numbers are available.") : ""}
                inputProps={{ maxLength: 10 }}
              />


              <TextField
                id="indc_kiwa"
                label="KIWA Code"
                variant="outlined"
                size='small'
                value={formData.indc_kiwa}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setFormData({ ...formData, indc_kiwa: value });
                    setKiwaError(false);
                  } else {
                    setKiwaError(true);
                  }
                }}
                error={kiwaError}
                helperText={kiwaError ? "Only Numbers are available." : ""}
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                id="indc_italy"
                label="ITALY Code"
                variant="outlined"
                size='small'
                value={formData.indc_italy}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setFormData({ ...formData, indc_italy: value });
                    setItalyError(false);
                  } else {
                    setItalyError(true);
                  }
                }}
                error={italyError}
                helperText={italyError ? "Only Numbers are available." : ""}
                inputProps={{ maxLength: 10 }}
              />

            </Box>

            <Box style={{ marginBottom: 15 }}>
              <TextField
                     id="indc_desc"
                     label="Description"
                     variant="outlined"
                     size='small'
                     fullWidth
                     value={formData.indc_desc}
                     onChange={(e) => setFormData({...formData, indc_desc: e.target.value})}
                     inputProps={{ maxLength: 30 }}
                />
            </Box>
            <Box>
            <TextField
                  id="indc_rmk"
                  label="Remarks"
                  variant="outlined"
                  size='small'
                  fullWidth
                  value={formData.indc_rmk}
                  onChange={(e) => setFormData({...formData, indc_rmk: e.target.value})}
                  inputProps={{ maxLength: 50 }}
              />
            </Box>
            <Box sx={{
              width: 1000,
              height: 40,
              borderRadius: 1,
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              }}>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ marginRight: 20 }}
                  onClick={onClickSave}
                >
                  CREATE
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  style={{ marginRight: 20 }}
                  disabled={!selectedRow}
                  onClick={onClickUpdate}

                >
                  UPDATE
                </Button>
                <Button
                  variant='contained'
                  color="error"
                  style={{ marginRight: 20 }}
                  disabled={!selectedRow}
                  onClick={onClickDelete}

                >
                  DELETE
                </Button>
               <Button
                variant='contained'
                color='error'
                style={{ marginRight: 20 }}
                onClick={handleReset}
              >
                Reset
              </Button>

            </Box>
          </Box>
          </form>
        </Box>
</Box>
</Container>
    
  );
};

export default IndustryManager;