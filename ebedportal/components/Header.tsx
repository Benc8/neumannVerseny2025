import React from "react";

const Header = () => {
  return (
    <header className={"flex justify-between w-full p-3"}>
      <div>
        <h2>Logo</h2>
      </div>
      <div>
        <h1 className={"text-2xl font-semibold"}>EbédPortál</h1>
      </div>
      <div>
        <h2>Sign In</h2>
      </div>
    </header>
  );
};
export default Header;
