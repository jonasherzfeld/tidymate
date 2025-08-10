<!-- UserImage.svelte -->
<script>
  import { BASE_API_URI } from "$lib/utils/constants";
  import UnknownAvatar from "$lib/img/Unknown_person.jpg";

  let {
    filename,
    size = "thumbnail", // Default size
    alt = "User profile",
    class: className = "",
    width = null,
    height = null,
    lazy = true,
    fallbackSrc = UnknownAvatar,
    onLoad = null,
    onError = null,
    ...restProps
  } = $props();

  let imgElement = $state();
  let loaded = $state(false);
  let error = $state(false);
  let currentSrc = $state("");

  // Generate image URL based on parameters
  function getImageUrl(filename, size) {
    if (!filename) return fallbackSrc;

    // Remove any existing size suffix from filename and replace with new size
    // Input: /file/userdata/{user_id}/{filename_base}_thumbnail.webp
    // Output: /file/userdata/{user_id}/{filename_base}_{size}.webp
    const baseFilename = filename.replace(/_\w+\.webp$/, ""); // Remove _thumbnail.webp or similar
    const relativeUrl = `${baseFilename}_${size}.webp`;

    // Convert relative URL to absolute URL with API base URI
    if (relativeUrl.startsWith("/file/")) {
      const finalUrl = BASE_API_URI + relativeUrl;
      return finalUrl;
    }
    return relativeUrl;
  }

  // Auto-detect best size based on display dimensions
  function getOptimalSize(displayWidth) {
    if (displayWidth <= 64) return "thumbnail";
    if (displayWidth <= 128) return "medium";
    return "original";
  }

  // Update src when props change
  $effect(() => {
    if (size === "auto" && width) {
      const optimalSize = getOptimalSize(width);
      currentSrc = getImageUrl(filename, optimalSize);
    } else {
      currentSrc = getImageUrl(filename, size);
    }
  });

  function handleLoad(event) {
    loaded = true;
    error = false;
    onLoad?.(event);
  }

  // Progressive enhancement - load higher res on interaction
  function loadHigherRes() {
    if (size === "thumbnail") {
      const higherResSrc = getImageUrl(filename, "medium");
      const img = new Image();
      img.onload = () => {
        currentSrc = higherResSrc;
      };
      img.src = higherResSrc;
    }
  }
</script>

<img
  bind:this={imgElement}
  src={currentSrc}
  {alt}
  crossorigin="use-credentials"
  class={className}
  {width}
  {height}
  loading={lazy ? "lazy" : "eager"}
  onload={handleLoad}
  class:loaded
  class:error
  {...restProps} />
