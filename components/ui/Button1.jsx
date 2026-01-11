"use client";
export default function Button1({value, method}) {

  return (
    <div className="">
      <button onClick={method} className="bubbleeffectbtn rounded-md" type="button">
        <style jsx>{`
          .bubbleeffectbtn {
            min-width: 180px;
            height: 48px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            outline: none;
            border: none;
            background: teal;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1;
            overflow: hidden;
          }

          .bubbleeffectbtn:before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.1),
              rgba(255, 255, 255, 0)
            );
            transform: rotate(45deg);
            transition: all 0.5s ease;
            z-index: -1;
          }

          .bubbleeffectbtn:hover:before {
            top: -100%;
            left: -100%;
          }

          .bubbleeffectbtn:after {
            position: absolute;
            content: '';
            width: 0;
            height: 100%;
            top: 0;
            z-index: -1;
            box-shadow:
              inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
              7px 7px 20px 0px rgba(0, 0, 0, 0.1),
              4px 4px 5px 0px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            background: linear-gradient(
              45deg,
              teal,gray
            );;
            right: 0;
          }

          .bubbleeffectbtn:hover:after {
            width: 100%;
            left: 0;
          }

          .bubbleeffectbtn:active {
            top: 2px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            background: linear-gradient(45deg, #212529, #343a40);
          }

          .bubbleeffectbtn span {
            position: relative;
            z-index: 2;
          }
        `}</style>

        <span className="text-sm font-medium">{value}</span>
      </button>
    </div>
  );
}