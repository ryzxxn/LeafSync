import { Link } from "react-router-dom";
import Copyright from "../component/copyright";
import { IoLogoJavascript } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { TbWorld } from "react-icons/tb";

export default function Home() {
  return (
    <div className='main'>
      <div className='hero_container'>
        <div>
          <h2 className='hero_text'>LeafSync</h2>
          <p className='hero_desc'>Effortless Database Management: Unleash the Power to View, Edit, and Manage Your Data with Ease</p>
          <p className='hero_desc'>- Built using <IoLogoJavascript /></p>
          <p className='hero_desc'>- Security <MdOutlineSecurity /></p>
          <p className='hero_desc'>- Open Source <TbWorld /></p>
        </div>
        <div>
          {/* Updated Link with correct relative path */}
          <Link className='href' to="../connect">Get Started</Link>
        </div>
      </div>
      <Copyright/>
    </div>
  );
}
