import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { supabase } from "@/lib/supabase";

const TYPE_CONNECT_BIG = 11;
const TYPE_CONNECT_SMALL = 12;

type ButtonConfig = {
  button_config_id: number;
  text: string | null;
  sub_text: string | null;
  text_color: string | null;
  background_image_id: number | null;
  background_color: string | null;
  background_gradient: string | null;
  link: string | null;
  internal_link: boolean | null;
  internal_page_id: number | null;
  icon: string | number | null;
  icon_color: string | null;
};

type ButtonSetup = {
  button_id: number;
  button_name: string | null;
  type_id: number;
  shape_id: number | null;
  page_id: number;
  button_config: ButtonConfig | null;
  icon_url?: string | null;
  bg_url?: string | null;
};

type ImageRow = { image_id: number; image_link: string };

const openURL = (url: string) =>
  Linking.openURL(url).catch((e) => console.error("Failed to open URL", e));

export default function Connect() {
  const [loading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ButtonSetup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { width: screenW } = useWindowDimensions();

  // layout sizes derived from screen width
  const layout = useMemo(() => {
    const containerW = Math.min(screenW * 0.9, 800);
    const bigGap = 1;                  // space between big tiles
    const bigSide = Math.round((containerW - bigGap) / 2); // 2 columns, 1 gap
    const bigRadius = 30;
    const iconBigSide = Math.round(bigSide * 0.66);

    const smallStripW = containerW;
    const smallItem = 60;               // outer touch size
    const smallIcon = 50;               // icon size

    return {
      containerW,
      bigGap,
      bigSide,
      bigRadius,
      iconBigSide,
      smallStripW,
      smallItem,
      smallIcon,
    };
  }, [screenW]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: page, error: pageErr } = await supabase
        .from("page")
        .select("page_id")
        .eq("page_name", "connect")
        .single();
      if (pageErr) throw pageErr;

      const { data: setups, error: bsErr } = await supabase
        .from("button_setup")
        .select(`
          button_id,
          button_name,
          type_id,
          shape_id,
          page_id,
          button_config:button_config_id (
            button_config_id,
            text,
            sub_text,
            text_color,
            background_image_id,
            background_color,
            background_gradient,
            link,
            internal_link,
            internal_page_id,
            icon,
            icon_color
          )
        `)
        .eq("page_id", page.page_id)
        .order("button_id", { ascending: true })
        .range(0, 199);
      if (bsErr) throw bsErr;

      const typed = (setups ?? []) as unknown as ButtonSetup[];

      const imageIds = new Set<number>();
      for (const s of typed) {
        const c = s.button_config;
        if (!c) continue;
        if (typeof c.background_image_id === "number") imageIds.add(c.background_image_id);
        if (typeof c.icon === "number") imageIds.add(c.icon);
        if (typeof c.icon === "string" && /^\d+$/.test(c.icon.trim())) {
          imageIds.add(parseInt(c.icon.trim(), 10));
        }
      }

      let imagesById = new Map<number, string>();
      if (imageIds.size) {
        const { data: imgs, error: imgErr } = await supabase
          .from("images")
          .select("image_id, image_link")
          .in("image_id", Array.from(imageIds));
        if (imgErr) throw imgErr;
        imagesById = new Map((imgs as ImageRow[]).map((r) => [r.image_id, r.image_link]));
      }

      const hydrated = typed.map((s) => {
        const c = s.button_config;
        let iconUrl: string | null = null;

        if (c?.icon != null) {
          if (typeof c.icon === "number") iconUrl = imagesById.get(c.icon) ?? null;
          else if (typeof c.icon === "string") {
            const t = c.icon.trim();
            if (/^\d+$/.test(t)) iconUrl = imagesById.get(parseInt(t, 10)) ?? null;
            else if (t.startsWith("http")) iconUrl = t;
          }
        }

        const bgUrl =
          c?.background_image_id != null
            ? imagesById.get(c.background_image_id) ?? null
            : null;

        return { ...s, icon_url: iconUrl, bg_url: bgUrl };
      });

      setButtons(hydrated);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasConnectTypes = useMemo(
    () => buttons.some((b) => b.type_id === TYPE_CONNECT_BIG || b.type_id === TYPE_CONNECT_SMALL),
    [buttons]
  );

  const big = useMemo(
    () => buttons.filter((b) => (hasConnectTypes ? b.type_id === TYPE_CONNECT_BIG : b.type_id === 1)),
    [buttons, hasConnectTypes]
  );
  const small = useMemo(
    () => buttons.filter((b) => (hasConnectTypes ? b.type_id === TYPE_CONNECT_SMALL : b.type_id === 2)),
    [buttons, hasConnectTypes]
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ color: "red" }}>{error}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.header, { width: layout.containerW }]}>
        <Text style={styles.title}>Get Involved</Text>
        <Text style={styles.subtitle}>Steps to become closer to SOL</Text>
      </View>

      <View style={[styles.bigGrid, { width: layout.containerW, rowGap: layout.bigGap }]}>
        {big.map((btn) => (
          <BigTile key={btn.button_id} btn={btn} side={layout.bigSide} radius={layout.bigRadius} iconSide={layout.iconBigSide} />
        ))}
      </View>

      <View style={[styles.smallStrip, { width: layout.smallStripW }]}>
        {small.map((btn) => (
          <SmallStripItem key={btn.button_id} btn={btn} itemSide={layout.smallItem} iconSide={layout.smallIcon} />
        ))}
      </View>
    </ScrollView>
  );
}

function BigTile({
  btn,
  side,
  radius,
  iconSide,
}: {
  btn: ButtonSetup;
  side: number;
  radius: number;
  iconSide: number;
}) {
  const c = btn.button_config;
  if (!c) return null;

  const press = () => {
    if (c.link) return openURL(c.link);
    if (c.internal_link && c.internal_page_id) console.log("Navigate to internal:", c.internal_page_id);
  };

  const frame = { width: side, height: side, borderRadius: radius } as const;

  if (btn.bg_url && !btn.icon_url) {
    return (
      <TouchableOpacity onPress={press} activeOpacity={0.85} style={[styles.bigTile, frame]}>
        <ImageBackground source={{ uri: btn.bg_url }} style={styles.fill} imageStyle={{ borderRadius: radius }} />
      </TouchableOpacity>
    );
  }

  const content = btn.icon_url ? (
    <Image source={{ uri: btn.icon_url }} style={{ width: iconSide, height: iconSide, alignSelf: "center" }} resizeMode="contain" />
  ) : (
    <View style={[styles.fill, { backgroundColor: c.background_color ?? "#EEE" }]} />
  );

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.85} style={[styles.bigTile, frame]}>
      {btn.bg_url ? (
        <ImageBackground source={{ uri: btn.bg_url }} style={styles.fill} imageStyle={{ borderRadius: radius }}>
          {content}
        </ImageBackground>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}

function SmallStripItem({
  btn,
  itemSide,
  iconSide,
}: {
  btn: ButtonSetup;
  itemSide: number;
  iconSide: number;
}) {
  const c = btn.button_config;
  if (!c) return null;

  const press = () => {
    if (c.link) return openURL(c.link);
    if (c.internal_link && c.internal_page_id) console.log("Navigate to internal:", c.internal_page_id);
  };

  const frame = { width: itemSide, height: itemSide, borderRadius: itemSide / 2 } as const;

  if (btn.bg_url && !btn.icon_url) {
    return (
      <TouchableOpacity onPress={press} activeOpacity={0.85} style={[styles.smallDot, frame]}>
        <ImageBackground source={{ uri: btn.bg_url }} style={styles.fill} imageStyle={{ borderRadius: frame.borderRadius }} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.85} style={[styles.smallDot, frame]}>
      {btn.icon_url ? (
        <Image source={{ uri: btn.icon_url }} style={{ width: iconSide, height: iconSide }} resizeMode="contain" />
      ) : (
        <View style={{ width: iconSide, height: iconSide, backgroundColor: c.background_color ?? "#EEE" }} />
      )}
    </TouchableOpacity>
  );
}

const BLUE = "#2E6FF2";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: BLUE,
  },
  subtitle: {
    fontSize: 16,
    color: BLUE,
    marginTop: 4,
  },
  bigGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 28,
  },
  bigTile: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  smallStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 100,
  },
  smallDot: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  fill: { width: "100%", height: "100%" },
});
