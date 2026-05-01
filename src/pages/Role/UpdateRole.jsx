import './Role.css'
const UpdateRole = () => {
  return (
    <div className="mt-5 mb-24 w-full">
      <h3 className="text-3xl font-bold text-center">Update Role </h3>
      <form>
        <div className="formControl my-5 mx-3">
          <div className="role">
            <input
              name="name"
              placeholder="Role Name "
              type="text"
              autoComplete="off"
            />
            <select autoComplete="off" >
              <option value="">Select Status</option>
              <option value="">Active </option>
              <option value="">Inactive</option>
            </select>
          </div>
        </div>


      </form>
      <div className="overflow-x-auto ">
        <table className="table ">
          <thead className='tableWrap'>
            <tr>
              <th><input type="checkbox" /></th>
              <th> SL No </th>
              <th>Page Access  </th>
              <th>Create </th>
              <th>Edit </th>
              <th>View </th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>01</td>
              <td>Invoice</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>01</td>
              <td>Invoice</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>01</td>
              <td>Invoice</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>01</td>
              <td>Invoice</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>01</td>
              <td>Invoice</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rolebtnWrap">
        <button className="submitBtn" type="submit">
          Update Role
        </button>
      </div>
    </div>
  );
};

export default UpdateRole;