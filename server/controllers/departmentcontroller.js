import Department from "../models/Department.js";


const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    return res.status(200).json({ success: true, departments })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department seerver error" })


  }

}

const addDepartment = async (req, res) => {
  try {
    //     console.log("✅ ADD DEPARTMENT API HIT");
    // console.log("BODY:", req.body);
    // console.log("USER:", req.user);

    let { dep_name, description, employeeCount } = req.body;
    dep_name = dep_name.trim().toUpperCase();
    const newDep = new Department({
      dep_name, description, employeeCount: employeeCount || 0,
    })
    await newDep.save()
    return res.status(200).json({ success: true, department: newDep })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in add department" })

  }

}


const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDep = await Department.findByIdAndDelete(id);

    if (!deletedDep) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export { addDepartment, getDepartments ,deleteDepartment}
// import Department from "../models/Department.js";

// const addDepartment = async (req, res) => {
//   try {
//     console.log("👉 BODY RECEIVED:", req.body);

//     const { dep_name, description } = req.body;

//     const newDep = new Department({
//       dep_name,
//       description,
//     });

//     await newDep.save();

//     return res.status(201).json({
//       success: true,
//       department: newDep,
//     });
//   } catch (error) {
//     console.error("❌ ADD DEPARTMENT ERROR FULL:", error);

//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// export { addDepartment };
