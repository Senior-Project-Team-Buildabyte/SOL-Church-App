import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DynamicButton from "../universal/dynamic-button";

const DynamicEventSection = () => {
  const [buttons, setButtons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchButtons = async () => {
      try {
        const { data, error } = await supabase
          .from("button_setup")
          .select(`
            button_id,
            type_id,
            shape_id,
            button_config:button_config_id(
              text,
              sub_text,
              icon,
              link,
              background_color,
              background_gradient,
              background_image_id,
              background_image:background_image_id(image_link)
            ),
            page:page_id(page_name)
          `)
          .eq("page.page_name", "home")
          .eq("type_id", 0); // only type 0 for events

        if (error) throw error;

        const formatted = (data ?? []).map((btn) => ({
          type: btn.type_id ?? 0,
          shape: btn.shape_id ?? 0,
          buttonConfig: {
            text: btn.button_config?.text,
            subText: btn.button_config?.sub_text,
            icon: btn.button_config?.icon,
            link: btn.button_config?.link,
            backgroundColor: btn.button_config?.background_color,
            backgroundGradient: btn.button_config?.background_gradient
              ? JSON.parse(btn.button_config.background_gradient)
              : undefined,
            backgroundImage:
              btn.button_config?.background_image?.image_link ?? null,
          },
        }));

        setButtons(formatted);
      } catch (err) {
        console.error("Error loading event buttons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchButtons();
  }, []);

  if (loading) return null;

  return <DynamicButton buttons={buttons} />;
};

export default DynamicEventSection;
