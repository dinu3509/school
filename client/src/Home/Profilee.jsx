import React, { useEffect, useContext, useState } from "react";
import { zoro } from "../assets";
import UserContext from "../pages/UserContext";
import axios from "axios";

const Profilee = () => {
  const section = "profile";
  const profile = [
    "Campus",
    "College",
    "Batch",
    "Degree",
    "Program",
    "Branch",
    "Class",
    "Section",
    "Semester",
  ];
  const personal = [
    "Student Full Name",
    "Aadhar Number",
    "DOB",
    "Blood Group",
    "Mobile Number",
    "E-mail",
    "Gender",
    "Nationality",
    "Religion",
    "Father Name",
    "Mother Name",
    "Category",
  ];
  const address = [
    "Door Number",
    "Location",
    "City",
    "State",
    "Country",
    "Pincode",
  ];
  const { semester, setSemester } = useContext(UserContext);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { uid, setUid } = useContext(UserContext);
  console.log(uid);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (uid) {
      localStorage.setItem("uid", uid);
    }
  }, [uid]);
  useEffect(() => {
    const savedUid = localStorage.getItem("uid");
    if (savedUid && !uid) {
      setUid(savedUid);
    }
  }, [uid, setUid]);

  useEffect(() => {
    if (uid) {
      axios
        .post("https://school-server-nine-pi.vercel.app/home", { uid, section })
        .then((res) => {
          if (res.data.user) {
            const user = res.data.user;

            const userArray = Object.keys(user).map((key) => {
              return { key: key, value: user[key] };
            });

            setUserData(userArray);
            console.log(userArray);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [uid]);

  {
    useEffect(() => {
      if (userData.length > 0) {
        const semesterValue = userData.find(
          (item) => item.key === "semester"
        )?.value;
        if (semesterValue) {
          const updatedSemester = Number(semesterValue) - 1;
          setSemester(updatedSemester);
          localStorage.setItem("semester", updatedSemester); // Store semester value
          console.log("Updated semester:", updatedSemester);
        }
      }
    }, [userData, setSemester]);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-auto border rounded-2xl pt-30 pb-5 px-5 relative mt-20 lg:mt-25">
          <div className="absolute top-[-35px] text-2xl font-bold left-2">
            PROFILE
          </div>
          <div className="">
            <img
              src={zoro}
              className="lg:w-50 lg:h-50 w-40 h-40 rounded-full  absolute top-[0] left-0 right-0 bottom-full m-auto"
              alt="User"
            />
          </div>
          <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-5 gap-y-12 sm:grid-cols-2">
            <div
              className={`relative border p-1 rounded-lg relative"bg-gray-700" 
          }`}
            >
              {userData.find((item) => item.key === "uid")?.value}
              <div className="absolute top-[-20px] left-0 text-xs">
                Registration Number
              </div>
            </div>
            {profile.map((label, index) => (
              <div
                key={index}
                className={`border p-1 rounded-lg relative ${
                  index % 2 === 0 ? "bg-gray-700" : ""
                }`}
              >
                {
                  userData.find((item) => item.key === label.toLowerCase())
                    ?.value
                }
                <div className="absolute top-[-20px] left-0 text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-auto pt-10 border w-full mt-15 p-5 rounded-2xl relative">
          <div className="absolute top-[-35px] text-2xl font-bold left-2">
            PERSONAL DETAILS
          </div>
          <div className="relative grid lg:grid-cols-5 md:grid-cols-4 gap-5 gap-y-12 sm:grid-cols-2">
            {personal.map((label, index) => (
              <div
                key={index}
                className="border p-1 rounded-lg relative bg-gray-700"
              >
                {
                  userData.find((item) => item.key === label.toLowerCase())
                    ?.value
                }
                <div className=" absolute top-[-20px] left-0 text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-auto pt-10 border w-full m-15 p-5 rounded-2xl relative">
          <div className="absolute top-[-35px] text-2xl font-bold left-2">
            PERMANENT ADDRESS
          </div>
          <div className="relative grid lg:grid-cols-5 md:grid-cols-4 gap-5 gap-y-12 sm:grid-cols-2">
            {address.map((label, index) => (
              <div
                key={index}
                className="border p-1 rounded-lg relative bg-gray-700"
              >
                {
                  userData.find((item) => item.key === label.toLowerCase())
                    ?.value
                }
                <div className=" absolute top-[-20px] left-0 text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profilee;
