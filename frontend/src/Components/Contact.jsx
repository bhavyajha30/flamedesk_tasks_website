import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Send } from "lucide-react";

const Contact = ({ profile }) => {
  const form = useRef();
  const [sent, setSent] = useState(false);

  const [message, setMessage] = useState("");

  document.title = "Enquire | Contact";

  const navigate = useNavigate();

  const sendEmail = (e) => {
    e.preventDefault();

    if(sent) return;

    setSent(true);

    emailjs
      .sendForm("service_d0pi0mb", "template_gcjdhte", form.current, {
        publicKey: "GMFCMlefK3Tekxj9A",
      })
      .then(
        () => {
          toast.success("Message Sent!");
          setMessage(""); // Clear message field only after success
        },
        (error) => {
          toast.warning("Error: Message not sent!");
        }
      );

    setTimeout(() => {
      setSent(false);
    }, 2 * 60 * 1000);
  };

  return (
    <div className="text-gray-800 flex flex-col -mb-5 justify-between sm:block h-fit w-full bg-gradient-to-br from-white to-gray-100 overflow-y-auto">
      <ToastContainer />
      <div className="px-[10vw] sm:px-[2vw]">
        <h1 className="text-[8vw] mt-[8vw] sm:mt-0 sm:text-[3vw] font-bold text-[#6556CD] tracking-wider">
          Contact Us
        </h1>
        <p className="text-[3vw] sm:text-[1.2vw] font-semibold sm:uppercase text-gray-700 w-full sm:w-[70%] sm:leading-[1.5vw]">
          Let's connect! We’re here to help and would love to hear from you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row mt-[5vw]">
        <div className="sm:w-[50%] mt-[5vw] sm:mt-0 w-full flex flex-col">
          <form
            ref={form}
            onSubmit={sendEmail}
            className="flex mx-auto flex-col w-[70%] gap-[5vw] sm:gap-[2vw]"
          >
            {/* Name Field */}
            <div className="relative">
              <label className="absolute px-2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-lg -top-[1.8vw] sm:-top-[0.6vw] left-[5vw] sm:left-[1.5vw] block text-white text-[3vw] sm:text-[1vw]">
                Name
              </label>
              <input
                type="text"
                name="from_name"
                value={profile?.name || ""}
                readOnly
                className="h-[10vw] sm:h-[3vw] w-full border-2 rounded-lg border-gray-400 pt-3 pb-2 bg-gray-100 outline-none text-gray-800 px-[1.5vw]"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="absolute px-2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-lg -top-[1.8vw] sm:-top-[0.6vw] left-[5vw] sm:left-[1.5vw] block text-white text-[3vw] sm:text-[1vw]">
                Email
              </label>
              <input
                type="email"
                name="from_email"
                value={profile?.email || ""}
                readOnly
                className="h-[10vw] sm:h-[3vw] w-full border-2 rounded-lg border-gray-400 pt-3 pb-2 bg-gray-100 outline-none text-gray-800 px-[1.5vw]"
              />
            </div>

            {/* Message Field */}
            <div className="relative">
              <label className="absolute px-2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-lg -top-[1.8vw] sm:-top-[0.6vw] left-[5vw] sm:left-[1.5vw] block text-white text-[3vw] sm:text-[1vw]">
                Message
              </label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[30vw] sm:min-h-[10vw] w-full border-2 rounded-lg border-gray-400 pt-3 pb-1 bg-transparent outline-none text-gray-800 px-[1.5vw]"
              />
            </div>

            <div className="w-full -mt-[3vw] sm:-mt-[1.5vw] flex justify-end">
              <button type="submit" className={`bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 ${sent ? "brightness-75" : "" } flex items-center justify-center gap-2 border border-[#6556CD] sm:text-[1.3vw] duration-300 h-[9vw] w-[22vw] sm:h-[3vw] sm:w-[15vw] text-white rounded font-semibold tracking-wider cursor-pointer`}>
            <Send className="text-white h-5 w-5"/>
            Send
              </button>
            </div>
          </form>
        </div>

        <div className="w-[60%] mx-auto sm:mx-0 sm:h-[30vw] flex items-end overflow-hidden sm:w-[50%] h-full">
          <img
            className="sm:h-[20vw] sm:w-[45vw]"
            src="Images/contact.png"
            alt="Contact"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
