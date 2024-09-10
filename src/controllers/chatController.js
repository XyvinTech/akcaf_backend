const responseHandler = require("../helpers/responseHandler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { getReceiverSocketId, chatNamespace, io } = require("../socket");
const validations = require("../validations");

exports.sendMessage = async (req, res) => {
  const { content, isGroup } = req.body;
  const to = req.params.id;
  const from = req.userId;

  try {
    let chat;

    if (isGroup) {
      chat = await Chat.findById(to);
    } else {
      chat = await Chat.findOne({
        participants: { $all: [from, to] },
        isGroup: false,
      });
    }

    const newMessage = new Message({
      from,
      to,
      content,
      status: "sent",
    });

    if (!chat) {
      if (isGroup) {
        chat = new Chat({
          _id: to,
          participants: [from],
          lastMessage: newMessage._id,
          unreadCount: {},
        });
      } else {
        chat = new Chat({
          participants: [from, to],
          lastMessage: newMessage._id,
          unreadCount: { [to]: 1 },
          isGroup: false,
        });
      }
    } else {
      chat.lastMessage = newMessage._id;
      if (isGroup) {
        chat.participants.forEach((participant) => {
          if (participant.toString() !== from) {
            chat.unreadCount.set(
              participant.toString(),
              (chat.unreadCount.get(participant.toString()) || 0) + 1
            );
          }
        });
      } else {
        chat.unreadCount.set(to, (chat.unreadCount.get(to) || 0) + 1);
      }
    }

    await Promise.all([chat.save(), newMessage.save()]);

    if (isGroup) {
      chatNamespace.to(to).emit("message", newMessage);
    } else {
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        chatNamespace.to(receiverSocketId).emit("message", newMessage);
      } else {
        console.log("Receiver is not online.");
      }
    }
    return responseHandler(res, 201, "Message sent successfully!", newMessage);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getBetweenUsers = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const messages = await Message.find({
      $or: [
        { from: id, to: userId },
        { from: userId, to: id },
      ],
    }).sort({ timestamp: 1 });

    await Message.updateMany(
      { from: userId, to: id, status: { $ne: "seen" } },
      { status: "seen" },
      { new: true }
    );

    await Chat.updateOne(
      { participants: { $all: [id, userId] } },
      { $set: { [`unreadCount.${id}`]: 0 } },
      { new: true }
    );

    await Chat.updateOne(
      { participants: { $all: [id, userId] } },
      {
        $set: {
          [`unreadCount.${userId}`]:
            (
              await Chat.findOne({
                participants: { $all: [id, userId] },
              })
            )?.unreadCount.get(userId) || 0,
        },
      },
      { new: true }
    );

    return responseHandler(
      res,
      200,
      "Messages retrieved successfully!",
      messages
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.userId })
      .populate("participants", "name image")
      .populate("lastMessage")
      .exec();

    return responseHandler(res, 200, "Chat retrieved successfully!", chats);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { error } = validations.createGroupSchame.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const { participantIds, groupName, groupInfo } = req.body;

    const newChat = new Chat({
      participants: participantIds,
      groupName,
      groupInfo,
      isGroup: true,
      unreadCount: participantIds.reduce((acc, userId) => {
        acc[userId] = 0;
        return acc;
      }, {}),
    });

    await newChat.save();

    return responseHandler(
      res,
      201,
      "Group chat created successfully!",
      newChat
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getGroupMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const messages = await Message.find({
      to: id,
    }).sort({ timestamp: 1 });

    if (!messages.length) {
      return responseHandler(res, 404, "No messages found in this group.");
    }

    await Message.updateMany(
      { to: id, status: { $ne: "seen" }, from: { $ne: userId } },
      { status: "seen" }
    );

    await Chat.updateOne(
      { _id: id },
      { $set: { [`unreadCount.${userId}`]: 0 } }
    );

    return responseHandler(
      res,
      200,
      "Group messages retrieved successfully!",
      messages
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getGroupList = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const group = await Chat.find({ isGroup: true })
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    const totalCount = await Chat.countDocuments();
    const mappedData = group.map((item) => {
      return {
        _id: item._id,
        groupName: item.groupName,
        groupInfo: item.groupInfo,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        memberCount: item.participants.length,
      };
    });

    return responseHandler(
      res,
      200,
      `Group list found successfull..!`,
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Group id is required`);
    }

    const group = await Chat.findById(id)
      .populate("participants", "name phone batch college memberId")
      .populate({
        path: "participants",
        populate: { path: "college" },
      });
    if (!group) {
      return responseHandler(res, 404, `Group not found`);
    }
    const mappedData = group.participants.map((item) => {
      return {
        _id: item._id,
        name: `${item.name.first} ${item.name.middle} ${item.name.last}`,
        phone: item.phone,
        batch: item.batch,
        college: item.college.collegeName,
        memberId: item.memberId ? item.memberId : null,
        status: item.status,
      };
    });
    return responseHandler(res, 200, `Group details`, mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.editGroup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Group id is required`);
    }
    const { error } = validations.editGroupSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const { groupName, groupInfo, participantIds } = req.body;

    const updateGroup = await Chat.findByIdAndUpdate(
      id,
      {
        groupName,
        groupInfo,
        participants: participantIds,
      },
      { new: true }
    );
    if (updateGroup) {
      return responseHandler(
        res,
        200,
        "Group updated successfully!",
        updateGroup
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Group id is required`);
    }

    const group = await Chat.findById(id);
    if (!group) {
      return responseHandler(res, 404, `Group not found`);
    }
    return responseHandler(res, 200, `Group details`, group);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Group id is required`);
    }
    const deleteGroup = await Chat.findByIdAndDelete(id);
    if (deleteGroup) {
      return responseHandler(
        res,
        200,
        "Group deleted successfully!",
        deleteGroup
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
