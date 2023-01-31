import { get } from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getdatauri from "../utils/datauri.js";
import ErrorHandling from "../utils/errorHandling.js";
import cloudinary from "cloudinary";

// get course
export const getallcourses = catchAsyncError(async (req, res, next) => {
  let keyword = req.query.keyword || "";
  let category = req.query.category || "";

  let data = await Course.find({
    title: {
      $regex: keyword,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  }).select("-lectures");

  res.status(200).json(data);
});

//  createcourse
export const createcourse = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdby, views } = req.body;
  if (!title || !description || !category || !createdby) {
    return next(new ErrorHandling("please enter all required fields", 400));
  }
  const file = req.file;
  const fileuri = getdatauri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileuri.content);

  await Course.create({
    title,
    description,
    createdby,
    category,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    views,
  });

  res.status(200).json({
    success: "Course Created Successfully",
  });
});

export const getcourselectures = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorHandling("course not found", 400));
  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

// add course lectures

export const addlectures = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description)
    return next(new ErrorHandling("input all fields", 404));
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorHandling("course not found", 400));

  const file = req.file;
  const fileuri = getdatauri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileuri.content, {
    resource_type: "video",
  });
  course.lectures.push({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
 });
  course.noOfVideos = course.lectures.length;
  await course.save();

  res.status(200).json({
    success: "Lecture Added Successfully",
    course,
  });
});

// api for delete course

export const deletecourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return next(new ErrorHandling("Cours nahi mila bhai", 400));

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    let singleLecture = course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
  }
  await course.remove();

  res.status(200).json({
    success: "delete ho gaya course",
  });
});

export const deletelecture = catchAsyncError(async (req, res, next) => {
  const { courseid, lectureid } = req.query;

  const course = await Course.findById(courseid);

  if (!course) return next(new ErrorHandling("course nahi mila", 400));

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureid) {
      return item;
    }
  });
  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureid) {
      return item;
    }
  });
  course.noOfVideos = course.lectures.length;

  await course.save();
  res.status(200).json({
    success: "delete ho gaya lecture",
  });
});
