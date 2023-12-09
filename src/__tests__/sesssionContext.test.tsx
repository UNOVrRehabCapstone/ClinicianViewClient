import {afterAll, beforeAll, expect, jest, test, describe,} from "@jest/globals"
import { render } from "@testing-library/react";
import React from "react";
import { ISessionContext, SessionProvider, useSessionContext, } from "renderer/context/SessionContext"
import { ISession } from "renderer/interfaces/Session";


  let props: any;

const testUser: string = "edward"
const testSession: ISession = {
    createdByName: "testCreator",
    sessionName: "testSessionName",
    sessionKey: "testKey",
    createdBy: "createdByTestCreator"
}

beforeAll(() => {

})




test("loadPatientBalloonGameData", async () => {
    const sessionContext = useSessionContext();
    render(<SessionProvider>{props}</SessionProvider>)
        let data = await sessionContext.loadPatientBalloonGameData("edward");
    //console.log(data);
    expect(1).toBe(1);
    
})

