import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import { CssVarsProvider } from "@mui/joy/styles";

export default function PurchaseSelect() {
  return (
    <CssVarsProvider>
      <form>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Select
            placeholder="Select a pet"
            name="foo"
            required
            sx={{ width: "300px", height:'40px',marginTop:'5px' }}
          >
            <Option value="dog">Addition </Option>
            <Option value="dog">Subtraction</Option>
          </Select>
        </Stack>
      </form>
    </CssVarsProvider>
  );
}
