import { NitroModules } from "nitrogen";

export default NitroModules.create({
  name: "Widget",

  functions: {
    /**
     * JS에서 위젯으로 메모 데이터를 보냄
     */
    exposeWidgetData: (notes: { id: string; title: string; content: string }[]) => {
      // native 쪽에서 처리 (위젯 갱신)
    },
  },
});
