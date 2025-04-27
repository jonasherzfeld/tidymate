import logging
import os


class Settings:
    def __init__(self):
        self.VAR_FLASK_SECRET_KEY = None
        self.VAR_LOG_DEBUG = None

    def load_environment_variables(self):
        for attr in dir(self):
            if attr.startswith("VAR_"):
                env_var_name = attr[4:]  # Strip "VAR_" prefix
                try:
                    value = os.environ[env_var_name]
                    setattr(self, attr, value)
                except KeyError:
                    logging.fatal(
                        f"Environment variable {env_var_name} not set.")
                    raise KeyError(
                        f"Environment variable {env_var_name} not set.")


settings = Settings()
