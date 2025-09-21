import Ex01InlineStyleExample from './ch04/Ex01InlineStyleExample.jsx'
import Ex02DynamicStyleExample from './ch04/Ex02DynamicStyleExample.jsx'
import Ex03CSSFileExample from './ch04/Ex03CSSFileExample.jsx'
import Ex04CSSModuleExample from './ch04/Ex04CSSModuleExample.jsx'
import Ex05StyledComponentExample from './ch04/Ex05StyledComponentExample.jsx'
import Ex06MUIButtonExample from './ch04/Ex06MUIButtonExample.jsx'
import Ex07MUITextFieldExample from './ch04/Ex07MUITextFieldExample.jsx'
import Ex08MUICardExample from './ch04/Ex08MUICardExample.jsx'
import Ex09MUILayoutExample from './ch04/Ex09MUILayoutExample.jsx'
import Ex10MUIDashboardExample from './ch04/Ex10Dashboard.jsx'
import TodoApp from './ch04/Q01TodoSolution.jsx'
// function App04() {
//   return (
//     // <Ex01InlineStyleExample/>
//     // <Ex02DynamicStyleExample/>
//     // <Ex03CSSFileExample/>
//     // <Ex04CSSModuleExample/>
//     // <Ex05StyledComponentExample/>
//   )
// }

// MUI 세팅
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App04() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <Ex06MUIButtonExample/> */}
            {/* <Ex07MUITextFieldExample/> */}
            {/* <Ex08MUICardExample/> */}
            {/* <Ex09MUILayoutExample/> */}
            {/* <Ex10MUIDashboardExample/> */}
            <TodoApp/>
        </ThemeProvider>
    );
}



export default App04;