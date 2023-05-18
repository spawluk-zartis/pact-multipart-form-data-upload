import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { readFileSync } from "fs";
import path from "path";
import * as uploadService from "../src/services/upload.service";

const provider = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "consumer",
  provider: "provider",
  logLevel: "debug"
});

describe("POST /api/upload", () => {
  const PDF_FILE_PATH = path.join(process.cwd(), "tests/empty.pdf");
  const PDF_FILE_DATA = readFileSync(PDF_FILE_PATH);

  it("upload data and return 201", () => {
    provider
      .uponReceiving("a request to upload pdf")
      .withRequestMultipartFileUpload(
        {
          method: "POST",
          path: `/api/upload`
        },
        "application/pdf",
        PDF_FILE_PATH,
        "file"
      )
      .willRespondWith({
        status: 204
      });

    return provider.executeTest(async (mockServer) => {
      await expect(
        uploadService.uploadPdf({
          baseUrl: mockServer.url,
          file: new Blob([PDF_FILE_DATA], {
            type: "application/pdf"
          })
        })
      ).resolves.not.toBeNull();
    });
  });
});
